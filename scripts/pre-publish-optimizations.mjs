import fs from 'node:fs/promises';  
import path from 'node:path';  
import postcss from 'postcss';  
import atImport from 'postcss-import';  
import prettier from 'prettier';  

async function inlineTailwindCSS() {  
  const __dirname = path.dirname(new URL(import.meta.url).pathname);  
  const filePath = path.resolve(__dirname, '../packages/tailwindcss/index.css');  

  try {  
    const contents = await fs.readFile(filePath, 'utf-8');  
    const result = await postcss([atImport()]).process(contents, { from: filePath });  
    const formattedCSS = await prettier.format(result.css, { filepath: filePath });  
    
    await fs.writeFile(filePath, formattedCSS, 'utf-8');  
    console.log('Tailwind CSS inlined and formatted successfully.');  
  } catch (error) {  
    console.error('Error processing Tailwind CSS:', error);  
  }  
}  

inlineTailwindCSS();
