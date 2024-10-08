import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

// Luodaan sqlite.db-tiedosto ja tietokanta, jos sitä ei ole olemassa: 
const sqlite = new Database("sqlite.db")
// Tallennetaan muuttujaan varsinainen tietokantayhteys:
export const db = drizzle(sqlite)