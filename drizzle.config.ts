import { defineConfig } from 'drizzle-kit'

/* Koska kyseessä demo keksityillä tiedoilla, ei laiteta objektin arvoja 
ympäristömuuttujiin */
export default defineConfig({
    dialect: 'sqlite', 
    // polku tiedostoon, jossa tietokannan rakenne on määritelty: 
    schema: './src/db/schema.ts', 
    dbCredentials: {
        url: 'sqlite.db'
    }
})