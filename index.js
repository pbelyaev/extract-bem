"use strict";

const htmlparser    = require('htmlparser2'),
      fs            = require('fs'),
      path          = require('path'),
      lbparser      = require('laravel-blade-parser');

class ExtractBEM
{
    /**
     * @param options
     */
    constructor(options)
    {
        this.items = {};
        this.currentFileName = null;
        this.files = [];
        this.defaultOptions = {
            directory: './src/html',
            extension: 'html',
            encoding: 'utf8',
            blade: false
        };
        this.options = Object.assign(this.defaultOptions, options ? options : {});

        this._fetchFiles();
        this._initParser();
        this._parse();
    }

    getBlocks()
    {
        return this.items;
    }

    /**
     * @private
     */
    _fetchFiles()
    {
        fs.readdirSync(this.options.directory)
          .filter(file => this._isFileExtensionIn(file, this.options.extension))
          .map(file => this.files.push(path.join(this.options.directory, file)));
    }

    /**
     * @private
     */
    _initParser()
    {
        this.parser = new htmlparser.Parser({
            onopentag: (name, attributes) => this._parseElement(name, attributes)
        }, {
            decodeEntities: true
        });
    }

    /**
     * @param name
     * @param attributes
     *
     * @private
     */
    _parseElement(name, attributes)
    {
        if(attributes.class) {
            let classNames = attributes.class.split(' ').filter(item => this._isBlock(item));

            if(classNames.length > 0) {
                classNames.map(item => this.items[this.currentFileName].push(item));
            }
        }
    }

    /**
     * @private
     */
    _parse()
    {
        this.files.forEach((item, key) => {
            let HTML = this._getHTMLFromFile(item);
            this.currentFileName = path.basename(item).replace(this._getExtensionsRegexFromOptions(), '');
            
            /* Cut out the blade extension */
            if(this.options.blade) {
                this.currentFileName = this.currentFileName.replace('.blade', '');
            }
            
            this.items[this.currentFileName] = [];

            this.parser.write(HTML);
        });
    }

    /**
     * @param file
     * @param extension
     *
     * @returns {boolean}
     * @private
     */
    _isFileExtensionIn(file, extension)
    {
        let fileExtension = file.split('.').splice(-1)[0];

        return typeof extension == 'object' ? extension.indexOf(fileExtension) > -1 : extension == fileExtension;
    }

    /**
     * @param className
     *
     * @returns {boolean}
     * @private
     */
    _isBlock(className)
    {
        return className.search(/(\_{2}|\-{2}|\{{2}|\}{2}|\$|\'|\"|\:)|\?/gi) == -1;
    }

    /**
     * @param path
     *
     * @returns {*}
     * @private
     */
    _getHTMLFromFile(path)
    {
        return this.options.blade == true ? lbparser({path: path, encoding: this.options.encoding}) : fs.readFileSync(path, this.options.encoding);
    }

    /**
     * @returns {*}
     * @private
     */
    _getExtensionsRegexFromOptions()
    {
        return new RegExp((typeof this.options.extension == 'object' ? '.' + this.options.extension.join('|.') : '.' + this.options.extension), 'i');
    }
}

module.exports = options => new ExtractBEM(options).getBlocks();