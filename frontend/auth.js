// AWS Cognito Configuration
const poolData = {
    UserPoolId: 'eu-north-1_OpG8lKF5F', // Extracted from your snippet
    ClientId: '2ndr7a15f6hshp2crd5bb4srck' // Extracted from your snippet
};

// We will use the global AmazonCognitoIdentity object from the CDN
let userPool;

function initAuth() {
    if (typeof AmazonCognitoIdentity === 'undefined') {
        console.error('Cognito SDK not loaded');
        alert('Error: AWS Cognito SDK failed to load. Please check your internet connection or ad-blockers.');
        return false;
    }
    if (!userPool) {
        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    }
    return true;
}

const Auth = {
    // Sign Up a new user
    signUp: (email, password) => {
        return new Promise((resolve, reject) => {
            if (!initAuth()) {
                reject(new Error('Cognito SDK not loaded'));
                return;
            }
            const attributeList = [
                new AmazonCognitoIdentity.CognitoUserAttribute({
                    Name: 'email',
                    Value: email,
                }),
            ];

            userPool.signUp(email, password, attributeList, null, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.user);
            });
        });
    },

    // Confirm registration with code
    confirm: (email, code) => {
        return new Promise((resolve, reject) => {
            initAuth();
            const userData = {
                Username: email,
                Pool: userPool,
            };
            const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

            cognitoUser.confirmRegistration(code, true, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    },

    // Sign In
    signIn: (email, password) => {
        return new Promise((resolve, reject) => {
            initAuth();
            const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                Username: email,
                Password: password,
            });

            const userData = {
                Username: email,
                Pool: userPool,
            };
            const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: (result) => {
                    resolve(result);
                },
                onFailure: (err) => {
                    reject(err);
                },
            });
        });
    },

    // Sign Out
    signOut: () => {
        initAuth();
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
            cognitoUser.signOut();
            window.location.href = 'login.html';
        }
    },

    // Check if user is logged in
    isAuthenticated: () => {
        return new Promise((resolve, reject) => {
            initAuth();
            const cognitoUser = userPool.getCurrentUser();
            if (cognitoUser != null) {
                cognitoUser.getSession((err, session) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log('Session valid:', session.isValid());
                    resolve(session.isValid());
                });
            } else {
                reject('No current user');
            }
        });
    },

    // Get Current User (Helper)
    getCurrentUser: () => {
        initAuth();
        return userPool.getCurrentUser();
    }
};

// Expose to window for app.js to use
window.Auth = Auth;
