/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/25/13
 * Description: This file will contain all of the environment specific variables
 ********************************************************************************/
module.exports = {
    development: {
        root: require('path').normalize(__dirname + '/..'),
        app: {
            name: 'uLink Administration - Dev'
        },
        mysql_db_url: 'mysql://root:root@127.0.0.1:3306/ulink_dev'
    }
    , test: {
        app: {
            name: 'uLink Administration - Test'
        },
        mysql_db_url: 'mysql://root:root@127.0.0.1:3306/ulink_dev'
    }
    , production: {
        app: {
            name: 'uLink Administration'
        },
        mysql_db_url: 'mysql://root:root@127.0.0.1:3306/ulink_dev'
    },
    image: {
        S3: {
            key: 'API_KEY',
            secret: 'SECRET',
            bucket: 'BUCKET_NAME'
        }
    }
}
