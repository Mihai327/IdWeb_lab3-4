node {
    stage('Checkout source code') {
        git branch: 'main', url: 'https://github.com/Mihai327/IdWeb_lab3-4.git'
    }

    stage('Install node modules') {
        bat "npm install"
    }

    stage('Test') {
        bat "npm run test-app"
    }

    stage('Build') {
        bat "npm run build --prod"
    }
}