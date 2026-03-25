import * as fs from 'fs';
import * as path from 'path';
import { procesarCodigo } from './core';
import { fabricarArchivos } from './out_manager';

try {
    const rutaInput = path.join(process.cwd(), 'input.txt');
    if (!fs.existsSync(rutaInput)) {
        console.error(">>> ERROR: Archivo input.txt no encontrado.");
        process.exit(1);
    }

    const rawData = fs.readFileSync(rutaInput, 'utf-8');
    const dataEstructurada = procesarCodigo(rawData);
    
    console.log(">>> Iniciando transpilación...");
    fabricarArchivos(dataEstructurada);
    console.log(">>> Transpilación finalizada con éxito.\n");

} catch (e) {
    console.error(">>> ERROR FATAL:", e);
}