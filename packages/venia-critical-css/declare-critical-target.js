module.exports = targets =>
    targets.declare({
        // A Set of strings which represent paths relative to
        // `venia-ui/lib/components`.
        criticalVeniaComponents: new targets.types.Sync(['componentNames'])
    });
