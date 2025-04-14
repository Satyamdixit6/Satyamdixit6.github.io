// Text Processing Utilities
function tokenize(text) {
    // Simple tokenizer - replace with your actual tokenization logic
    return text.split('').map(c => c.charCodeAt(0));
}

function detokenize(tokens) {
    return tokens.map(t => String.fromCharCode(Number(t))).join('');
}

// Image Processing Utilities
function encodePrompt(prompt) {
    // Simple embedding - replace with your actual text encoder
    const arr = new Float32Array(77).fill(0);
    prompt.split('').forEach((c, i) => {
        if (i < 77) arr[i] = c.charCodeAt(0) / 255;
    });
    return arr;
}