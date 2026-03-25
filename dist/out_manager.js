"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.fabricarArchivos = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const obtenerDefault = (tipo) => {
    const t = tipo.toLowerCase();
    if (t === 'int' || t === 'number')
        return '0';
    if (t === 'string')
        return '""';
    if (t === 'boolean')
        return 'false';
    return 'null';
};
const fabricarArchivos = (proyectos) => {
    proyectos.forEach(p => {
        const ruta = path.resolve(p.directorio, p.nombreModulo);
        if (!fs.existsSync(ruta)) {
            fs.mkdirSync(ruta, { recursive: true });
        }
        p.entidades.forEach(clase => {
            let cuerpo = `// Transpilado exitosamente\n\n`;
            cuerpo += `export class ${clase.nombreClase} {\n\n`;
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
exports.fabricarArchivos = fabricarArchivos;
