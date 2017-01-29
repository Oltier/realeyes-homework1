var memoryAdapter = require('sails-memory');

var config = {
    adapters: {
        memory: memoryAdapter,
    },
    
    connections: {
        default: {
            adapter: 'memory',
        },
        memory: {
            adapter: 'memory',
        }
    },
    
    defaults: {
        migrate: 'safe',
    }
}