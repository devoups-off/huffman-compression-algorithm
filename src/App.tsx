import React, {useState} from 'react';
import './App.css'

interface FrequencyMap {
    [key: string]: number;
}

interface HuffmanNode {
    char: string | null;
    freq: number;
    left: HuffmanNode | null;
    right: HuffmanNode | null;
}

interface HuffmanTable {
    [key: string]: string;
}

function countFrequencies(str: string): FrequencyMap {
    const freq: FrequencyMap = {};
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char in freq) {
            freq[char]++;
        } else {
            freq[char] = 1;
        }
    }
    return freq;
}

function createHuffmanTree(freq: FrequencyMap): HuffmanNode {
    const queue: HuffmanNode[] = [];
    for (const char in freq) {
        const node: HuffmanNode = {char, freq: freq[char], left: null, right: null};
        queue.push(node);
    }
    while (queue.length > 1) {
        const node1 = queue.shift() as HuffmanNode;
        const node2 = queue.shift() as HuffmanNode;
        const merged = {char: null, freq: node1.freq + node2.freq, left: node1, right: node2};
        queue.push(merged);
    }
    return queue.shift() as HuffmanNode;
}

function createHuffmanTable(tree: HuffmanNode): HuffmanTable {
    const table: HuffmanTable = {};

    function traverse(node: HuffmanNode, code: string) {
        if (node.char) {
            table[node.char] = code;
            return;
        }
        traverse(node.left as HuffmanNode, code + '0');
        traverse(node.right as HuffmanNode, code + '1');
    }

    traverse(tree, '');
    return table;
}

function compress(str: string, table: HuffmanTable): string {
    let compressed = '';
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        compressed += table[char];
    }
    return compressed;
}

function compressWithHuffman(str: string): string {
    const freq = countFrequencies(str);
    const tree = createHuffmanTree(freq);
    const table = createHuffmanTable(tree);
    const compressed = compress(str, table);
    return compressed;
}

function decompress(compressed: string, tree: HuffmanNode): string {
    let decompressed = '';
    let node = tree;
    for (let i = 0; i < compressed.length; i++) {
        if (compressed[i] === '0') {
            node = node.left as HuffmanNode;
        } else {
            node = node.right as HuffmanNode;
        }
        if (node.char) {
            decompressed += node.char;
            node = tree;
        }
    }
    return decompressed;
}

function App(): JSX.Element {
    const [inputText, setInputText] = useState('');
    const [compressedText, setCompressedText] = useState('');
    const [decompressedText, setDecompressedText] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleCompressClick = () => {
        if (inputText) {
            const compressed = compressWithHuffman(inputText);
            setCompressedText(compressed);
        }
    };

    const handleDecompressClick = () => {
        if (inputText) {
            const tree = createHuffmanTree(countFrequencies(inputText));
            const decompressed = decompress(compressedText, tree);
            setDecompressedText(decompressed);
        }
    };

    return (
        <div>
            <h2>Compression de Huffman</h2>
            <div className="button-container">
                <button onClick={handleCompressClick}>Compress</button>
                <button onClick={handleDecompressClick}>Decompress</button>
            </div>

            <div className="input-container">
                <label>Entrée :</label>
                <input type="text" value={inputText} onChange={handleInputChange}/>
            </div>
            <div className="input-container">
                <label>Sortie :</label>
                <textarea value={compressedText} className="output" readOnly/>
            </div>
            <div className="input-container">
                <label>Texte décompressé :</label>
                <textarea value={decompressedText} className="output" readOnly/>
            </div>
        </div>
    );
}

export default App;
