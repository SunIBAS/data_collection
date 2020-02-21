function deleteRequire(file) {
    delete require.cache[require.resolve(file)];
}


module.exports = {
    deleteRequire
};