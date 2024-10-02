(async () => {
    try {
        require("../db/connection.db");
        const User = require('../model/user.model');
        const config = require('../config/config');
        console.log(config.admin);
        const createdAdmin = await User.create(config.admin);
        if (createdAdmin) {
            console.log('admin created ' + `${createdAdmin}`);
            return process.exit(1);
        }
        console.log('create admin failed');
        return process.exit(1);
    } catch (error) {
        console.log(`server error:\n ` + `please first check if there is an admin\n` + ` then make sure database is connected\n` + error);
    }

})();