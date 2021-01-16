node {
    stage('Checkout source code') {
        git branch: 'main', url: 'https://github.com/DermengiIon/jenkins.git'
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