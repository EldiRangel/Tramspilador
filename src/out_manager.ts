import * as fs from 'fs';
import * as path from 'path';
import { Proyecto } from './interfaces';

const obtenerDefault = (tipo: string) => {
    const t = tipo.toLowerCase();
    if (t === 'int' || t === 'number') return '0';
    if (t === 'string') return '""';
    if (t === 'boolean') return 'false';
    return 'null';
};

export const fabricarArchivos = (proyectos: Proyecto[]) => {
    proyectos.forEach(p => {
        const ruta = path.resolve(p.directorio, p.nombreModulo);
        if (!fs.existsSync(ruta)) {
            fs.mkdirSync(ruta, { recursive: true });
        }

        p.entidades.forEach(clase => {
            let cuerpo = `export class ${clase.nombreClase} {\n\n`;

            clase.metodos.forEach(m => {
                const isVoid = m.retorno.toLowerCase() === 'void';
                const tipoTS = m.retorno.toLowerCase() === 'int' ? 'number' : m.retorno;
                
                const paramsTS = m.parametros.split(',').map(param => {
                    const partes = param.trim().split(/\s+/);
                    if (partes.length === 2) {
                        const tipoParam = partes[0].toLowerCase() === 'int' ? 'number' : partes[0];
                        return `${partes[1]}: ${tipoParam}`;
                    }
                    return param;
                }).filter(p => p !== "").join(', ');

                cuerpo += `    ${m.acceso} ${m.nombre}(${paramsTS}): ${tipoTS} {\n`;
                cuerpo += isVoid ? `        return;\n` : `        return ${obtenerDefault(m.retorno)};\n`;
                cuerpo += `    }\n\n`;
            });

            cuerpo += `}\n`;
            const filePath = path.join(ruta, `${clase.nombreClase}.ts`);
            fs.writeFileSync(filePath, cuerpo);
            console.log(`>>> [CREADO] ${filePath}`);
        });
    });
};