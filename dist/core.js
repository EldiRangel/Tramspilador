"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesarCodigo = void 0;
const procesarCodigo = (raw) => {
    return raw.split(/@subsystem/i)
        .filter(b => b.trim() !== '')
        .map(bloque => {
        const lineas = bloque.split('\n').map(l => l.trim());
        const dirMatch = lineas.find(l => l.toLowerCase().startsWith('path:'));
        const modMatch = lineas.find(l => l.toLowerCase().startsWith('name:'));
        const resultado = {
            directorio: dirMatch ? dirMatch.split(':')[1].trim() : './dist',
            nombreModulo: modMatch ? modMatch.split(':')[1].trim() : 'modulo',
            entidades: []
        };
        let claseActual = null;
        let visibilidadActual = 'public';
        lineas.forEach(linea => {
            if (linea.toLowerCase().startsWith('class:')) {
                claseActual = { nombreClase: linea.substring(6).trim().replace(/\s+/g, ''), metodos: [] };
                resultado.entidades.push(claseActual);
            }
            else if (/^(public|private|protected):$/i.test(linea)) {
                visibilidadActual = linea.replace(':', '').toLowerCase();
            }
            else if (linea.includes('(') && claseActual) {
                const match = linea.match(/(\w+)\s*\((.*)\)\s*:\s*(\w+)/);
                if (match) {
                    claseActual.metodos.push({
                        nombre: match[1],
                        parametros: match[2].trim(),
                        retorno: match[3],
                        acceso: visibilidadActual
                    });
                }
            }
        });
        return resultado;
    });
};
exports.procesarCodigo = procesarCodigo;
