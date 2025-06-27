import xlsx from "node-xlsx";
import fs from "fs";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputHeaders = {
    "Command": {
        value: "MERGE",
        handle: ""
    },
    "Status": {
        value: "Active",
        handle: ""
    },
    "Title": {
        value: "",
        handle: "name"
    },
    "Image Src": {
        handle: "itemimg1",
        option: "combine",
        combineWith: "itemimg2"
    },
    "Variant Price": {
        handle: "price",
        option: "plus",
        plusWith: "tax"
    },
    "Variant Taxable": {
        value: "FALSE",
        handle: ""
    },
    "Variant Inventory Qty": {
        handle: "stock"
    },
    "Variant Weight": {
        "handle": "",
        "value": "5"
    },
    "Variant Weight Unit": {
      "handle": "",
        "value": "g"
    },
    "Variant Inventory Tracker": {
        handle: "",
        value: "shopify"
    },
    "Metafield: properties.thc [single_line_text_field]": {
        handle: "thc"
    },
    "Metafield: properties.cbd [single_line_text_field]": {
        handle: "cbd"
    },
    "Metafield: properties.manufacturer [single_line_text_field]": {
        handle: "producerrel"
    },
    "Metafield: properties.strain [single_line_text_field]": {
        handle: "strain"
    },
    "Metafield: properties.genetics [single_line_text_field]": {
        handle: "genetics"
    },
    "Metafield: limits.include_to_limit [boolean]": {
        handle: "genetics"
    }
}

async function generateOutputFiles() {
    const productsArray = await fetch("https://cannovia.de/export/itemdata.json", {
    })
    .then(response => response.json())
    .then(data => {
        return data
    })

    const outputProductsArray = []
    productsArray.map((productObject, index) => {
        if (index > 9) {
            return;
        }

        const productArray = [];

        Object.keys(outputHeaders).forEach(headerKey => {
            if (outputHeaders[headerKey].handle === "") {
                productArray.push(outputHeaders[headerKey].value)
                return;
            }

            if (outputHeaders[headerKey].option === "plus") {
                const result = productObject[outputHeaders[headerKey].handle] + productObject[outputHeaders[headerKey].handle] * Number(`0.${productObject[outputHeaders[headerKey].plusWith]}`)
                productArray.push(Math.round(result * 100) / 100)
                return
            }

            if (outputHeaders[headerKey].option === "combine") {
                const result = `${productObject[outputHeaders[headerKey].handle]};${productObject[outputHeaders[headerKey].combineWith]}`
                productArray.push(result)
                return
            }

            productArray.push(productObject[outputHeaders[headerKey].handle])
        })

        outputProductsArray.push(productArray)
    })

    const outputProducts = [
        Object.keys(outputHeaders),
        ...outputProductsArray
    ]

    var Buffer = xlsx.build([{
        name: `ProductsFile`,
        data: outputProducts
    }])

    fs.writeFile("Products.xlsx", Buffer, () => {});
}

generateOutputFiles()