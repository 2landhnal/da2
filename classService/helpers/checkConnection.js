'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

// Count connect
export const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);
};

// Check over load
export const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum number of connections based on number of cores
        console.log(`Active connection: ${numConnection}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
        const maxConnections = numCores * 5;
        if (numConnection > maxConnections) {
            console.log('Connection overload detected');
        }
    }, _SECONDS); // Monitor every 5 seconds
};

export const checkConnectionGRPC = async (client) => {
    return new Promise((resolve, reject) => {
        const channel = client.getChannel();
        const currentState = channel.getConnectivityState(true);

        channel.watchConnectivityState(
            currentState,
            Date.now() + 5000,
            (err) => {
                if (err) {
                    reject(new Error('Failed to connect: ' + err.message));
                } else {
                    const newState = channel.getConnectivityState(true);
                    if (newState === grpc.connectivityState.READY) {
                        console.log('Successfully connected to service.');
                        resolve(true);
                    } else {
                        reject(
                            new Error(
                                'Connection not ready. Current state: ' +
                                    newState,
                            ),
                        );
                    }
                }
            },
        );
    });
};
