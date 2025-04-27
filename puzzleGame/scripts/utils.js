

function generateSolvablePermutation (n) {
    const totalPieces = n;
    let permutation;

    permutation = Array.from({ length: totalPieces - 1 }, (_, i) => i + 1);
    permutation.unshift(null); // Ensure null is always in position 0
    for (let i = 1; i < permutation.length; i++) { // Start shuffling from index 1
        const j = Math.floor(Math.random() * (i) + 1);
        [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }
    console.log("Generated permutation: ", permutation);
    return permutation;
};


export { generateSolvablePermutation };