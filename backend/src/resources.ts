import * as path from 'path';
import * as fs from 'fs';

const RESOURCES_DIR = path.normalize(path.join(__dirname, 'resources'))

function getPath(f: string) {
    return path.normalize(path.join(RESOURCES_DIR, f))
}

export function read(f: string) {
    return fs.readFileSync(getPath(f), 'utf-8')
}
