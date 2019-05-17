module.exports = {
    extends: ['nuxt'],
    rules:{
        'scope-enum':[
            2,
            'always',
            ['server','client']
        ]
    }
};
