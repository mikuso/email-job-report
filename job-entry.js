class JobEntry {
    constructor() {
        this._success = [];
        this._error = [];
        this._info = [];
        this._warning = [];

        this.group = null;
        this.name = null;
        this.description = null;
        this.duration = null;
    }

    get success() { return this._success; }
    get error() { return this._error; }
    get info() { return this._info; }
    get warning() { return this._warning; }

    set success(v) { this._success.push(v); }
    set error(v) { this._error.push(v); }
    set info(v) { this._info.push(v); }
    set warning(v) { this._warning.push(v); }
}

module.exports = JobEntry;
