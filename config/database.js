var conn_url = '127.0.0.1:27017/yugi';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {

  conn_url = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}

module.exports = {
	'url' : 'mongodb://' + conn_url
};
