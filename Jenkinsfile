pipeline {
    agent { docker }
    stages {
        stage('build') {
            steps {
                sh 'docker stop $(docker ps -a -q)'
		sh 'docker rm $(docker ps -a -q)'
		sh 'docker rmi $(docker images | grep opinionminer)'
		sh 'docker build . -t opinionminer'
		sh 'docker run -p 3000:3000 -d opinionminer'
            }
        }
    }
}
