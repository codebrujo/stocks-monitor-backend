//Run command:
//node cli/component_fn.js -n CompName

//Notes:
//Async await babel plugin to be set up https://stackoverflow.com/questions/53477466/react-referenceerror-regeneratorruntime-is-not-defined

const fs = require('fs');
const path = require('path')

const args = require('minimist')(process.argv.slice(2), { alias: { name: 'n' } });

const { name } = args;
const l_name = name.toLowerCase();

fs.mkdirSync(path.resolve(__dirname, '..', 'src', 'components', name));
fs.writeFileSync(
    path.resolve(__dirname, '..', 'src', 'components', name, `${name}.jsx`),
    `import './${name}.scss';
    
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
    
export default function ${name}(props) {

    useEffect(() => {
        fetchItems();
    }, []);

    const [items, setItems] = useState([]);
    const [clicked, setClicked] = useState(false);

    const fetchItems = async () => {
        const data = await fetch(
            'https://iss.moex.com/iss/securities.json?limit=10&start=0&group_by=type&group_by_filter=common_share'
        );

        const items = await data.json();
        setItems(items.data);
    }

    const handleClick = (e) => {
        console.log('${name} Clicked');
        setClicked(true);
    }

    return(
        <div className="${l_name}" onClick={handleClick}></div>
    )
}

${name}.propTypes = {}
`,
);

fs.writeFileSync(
    path.resolve(__dirname, '..', 'src', 'components', name, `${name}.scss`),
    `.${l_name} {}`,
);