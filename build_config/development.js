var path = require("path");

module.exports = function(_path){
	return {
		devtool: "cheap-module-source-map",
		devServer: {
            contentBase: path.join(_path, "public"),
            port: "8090"
        }
    };
};