function isSQLInjection(queryString) {
    if (typeof queryString !== 'string') return false;

    // Normalize string: remove all whitespace and make lowercase
    const normalized = queryString.replace(/\s+/g, '').toLowerCase();

    const patterns = [
        /or\d+=\d+/,                  // or1=1
        /and\d+=\d+/,                 // and1=1
        /['";]--/,                    // ' or ; followed by comment
        /unionselect/,               // union select
        /sleep\(\d+\)/,              // sleep(10)
        /benchmark\(\d+,/,           // benchmark(100000,...
        /droptable/,                 // drop table
        /dropdatabase/,              // drop database
        /xp_cmdshell/,               // SQL Server command shell
        /exec(ute)?/,                // exec or execute
        /information_schema/,        // schema probing
        /load_file\(/,               // load_file(
        /intooutfile/                // into outfile
    ];

    return patterns.some((regex) => regex.test(normalized));
}

module.exports = {
    isSQLInjection
};