/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/25/13
 * Description: This file will contain all of the environment specific
 *              configuration variables
 ********************************************************************************/
module.exports = {
    development: {
        root: require('path').normalize(__dirname + '/..'),
        app: {
            name: 'uLink Administration - Dev'
        },
        ac_allowed_origins: 'http://localhost:8889',
        mysql_db_url: 'mysql://root:root@127.0.0.1:3306/ulink_dev'
    }
    , test: {
        app: {
            name: 'uLink Administration - Test'
        },
        ac_allowed_origins: 'http://localhost:8889',
        mysql_db_url: 'mysql://root:root@127.0.0.1:3306/ulink_dev'
    }
    , production: {
        app: {
            name: 'uLink Administration'
        },
        ac_allowed_origins: 'http://admin.theulink.com:8889',
        mysql_db_url: 'mysql://ulink:ulink@205.186.160.144:3306/ulink_prod'
    },
    image: {
        S3: {
            key: 'API_KEY',
            secret: 'SECRET',
            bucket: 'BUCKET_NAME'
        }
    }
}
