pipeline {
    agent { docker { image 'node:12-alpine' } }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'npm install'
            }
        }
        stage('deploy') {
        	steps {
        		sh 'node index.js'
        	}
        }
    }
}