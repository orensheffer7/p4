const config={
    default : {
        SECRET: 'mysecretkey',
        DATABASE: 'mongodb://localhost:27017/P4'
    }
}


exports.get = function get(env){
    return config[env] || config.default
}
