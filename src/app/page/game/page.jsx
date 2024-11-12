'use client';
import './styles.css';
import './experiment.css';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import PlayField from 'game/app/components/game/PlayField';
import StatsPanel from 'game/app/components/game/StatsPanel';
import StatusMessage from 'game/app/components/game/StatusMessage';
import { useGetvalidTokenQuery } from 'game/app/store/services/users/user.api';
import { useGetAllScoresNameQuery } from 'game/app/store/services/scores/score.api';
import { useRegisterScoreMutation } from 'game/app/store/services/scores/score.api';

const AppWithHooks = (props) => {
    const [registerScore] = useRegisterScoreMutation();
    const { error: tokenError } = useGetvalidTokenQuery();
    const { refetch: fetchScores } = useGetAllScoresNameQuery({
        page: 1,
        limit: 10,
    });
    return (
        <App
            {...props}
            registerScore={registerScore}
            fetchScores={fetchScores}
            tokenError={tokenError}
        />
    );
};

class App extends Component {
    constructor(props) {
        super(props);
        const { user, token, tokenError } = props;
        this.userId = user ? user.userId : null;
        this.tokenError = tokenError ? tokenError : false;
        this.token = token;
        this.state = {
            snake: [],
            rabbits: [],
            status: 'READY',
            width: 20,
            height: 20,
            level: 1,
            successMessage: '',
            eatedRabbits: 0,
            score: 0,
            levelDelay: 200,
            defaults: {
                snakeLength: 3,
                rabbitsAmount: 1,
                startDelay: 200,
                levelStep: 5,
                length: 3,
                direction: 'RIGHT',
            },
        };
        this.interval = null;
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.tryToMove = this.tryToMove.bind(this);
    }

    gameOver() {
        if (this.state.status === 'GAME_OVER') return;
        this.setState({ status: 'GAME_OVER', loading: true });
        const { level, snake } = this.state;
        const finalScore = level * snake.length;
        this.setState({ score: finalScore });
        this.createScore(finalScore);
        clearInterval(this.interval);
    }

    async createScore(finalScore) {
        const scoreData = {
            scoreId: '',
            userId: this.userId,
            game: 'Snake Game',
            score: finalScore,
            createdAt: '',
            updatedAt: '',
        };
        try {
            const { registerScore } = this.props;
            const response = await registerScore(scoreData).unwrap();
            clearInterval(this.interval);
        } catch (error) {
            console.error('Error creating score:', error);
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
        this.gamePrepare();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
        clearInterval(this.interval);
    }

    handleKeyPress(event) {
        const { direction, status } = this.state;
        if (status === 'GAME_OVER') return;
        if (status === 'READY') {
            this.setState({ status: 'PLAYING' }, () => {
                this.setLevelDelay();
            });
        }
        switch (event.keyCode) {
            case 37:
                if (direction !== 'RIGHT') this.setState({ direction: 'LEFT' });
                break;
            case 38:
                if (direction !== 'DOWN') this.setState({ direction: 'UP' });
                break;
            case 39:
                if (direction !== 'LEFT') this.setState({ direction: 'RIGHT' });
                break;
            case 40:
                if (direction !== 'UP') this.setState({ direction: 'DOWN' });
                break;
            case 32:
                this.togglePause();
                break;
            default:
                break;
        }
    }

    getNextPosition() {
        const { snake, direction } = this.state;
        const snakeHead = snake[0];
        switch (direction) {
            case 'LEFT':
                return { x: snakeHead.x - 1, y: snakeHead.y };
            case 'UP':
                return { x: snakeHead.x, y: snakeHead.y - 1 };
            case 'RIGHT':
                return { x: snakeHead.x + 1, y: snakeHead.y };
            case 'DOWN':
                return { x: snakeHead.x, y: snakeHead.y + 1 };
            default:
                return snakeHead;
        }
    }

    checkWallCollisions(nextPosition) {
        const { width, height } = this.state;
        if (
            nextPosition.x < 0 ||
            nextPosition.x >= width ||
            nextPosition.y < 0 ||
            nextPosition.y >= height
        ) {
            return true;
        }
        return false;
    }

    checkSnakeCollisions(nextPosition, isGrowing) {
        const { snake } = this.state;
        let snakeTail = snake;
        if (!isGrowing) snakeTail = snakeTail.slice(0, -1);
        if (
            snakeTail.findIndex(
                (snakePart) =>
                    snakePart.x === nextPosition.x &&
                    snakePart.y === nextPosition.y,
            ) !== -1
        )
            return true;
        return false;
    }

    toMoveSnake(nextPosition, isGrowing) {
        const { snake, rabbits } = this.state;
        let newSnake = [],
            newRabbits = rabbits;
        if (isGrowing) {
            newSnake.push(nextPosition, ...snake);
        } else {
            newSnake.push(nextPosition, ...snake.slice(0, -1));
        }
        newRabbits = this.updateRabbits(nextPosition);
        this.setState({
            snake: newSnake,
            rabbits: newRabbits,
        });
    }

    checkRabbit(nextPosition) {
        const { rabbits } = this.state;
        if (
            rabbits.findIndex(
                (rabbit) =>
                    rabbit.x === nextPosition.x && rabbit.y === nextPosition.y,
            ) !== -1
        )
            return true;
        return false;
    }

    updateRabbits(nextPosition) {
        let newRabbits = this.state.rabbits;
        const { eatedRabbits, level } = this.state,
            levelStep = this.state.defaults.levelStep;
        const rabbitIndex = newRabbits.findIndex(
            (rabbit) =>
                rabbit.x === nextPosition.x && rabbit.y === nextPosition.y,
        );
        if (rabbitIndex !== -1) {
            newRabbits.splice(rabbitIndex, 1);
            if ((eatedRabbits + 1) % levelStep === 0) {
                this.setState({
                    level: level + 1,
                    eatedRabbits: eatedRabbits + 1,
                });
            } else {
                this.setState({ eatedRabbits: eatedRabbits + 1 });
            }
            this.setState({ level: level });
            const newRabbit = this.toAddNewRabbit(
                [].concat(nextPosition, this.state.snake),
            );
            const { snake } = this.state;
            const nivel = Math.floor(snake.length / 5) + 1;
            const Score = (snake.length + 1) * nivel;
            this.setState({ score: Score, level: nivel });
            newRabbits.push(newRabbit);
        }
        return newRabbits;
    }

    togglePause() {
        const { status } = this.state;
        if (status !== 'PAUSE' && status !== 'PLAYING') return false;
        if (status === 'PAUSE') {
            this.setState({ status: 'PLAYING' });
        } else {
            this.setState({ status: 'PAUSE' });
        }
        return true;
    }

    tryToMove() {
        const { status } = this.state;
        if (status === 'PAUSE') return false;
        let nextPosition = this.getNextPosition();
        const isGrowing = this.checkRabbit(nextPosition);
        if (
            this.checkWallCollisions(nextPosition) ||
            this.checkSnakeCollisions(nextPosition, isGrowing)
        ) {
            this.gameOver();
            return false;
        }
        this.toMoveSnake(nextPosition, isGrowing);
        return true;
    }

    gamePrepare() {
        const { snakeLength, rabbitsAmount, eatedRabbits, length, direction } =
            this.state.defaults;
        let snake = [],
            rabbits = [];
        for (let i = 0; i < snakeLength; i += 1) {
            let snakePart = { x: snakeLength - i - 1, y: 0 };
            snake.push(snakePart);
        }
        for (let i = 0; i < rabbitsAmount; i += 1) {
            const newRabbit = this.toAddNewRabbit(snake);
            rabbits.push(newRabbit);
        }
        this.setState({
            snake: snake,
            rabbits: rabbits,
            status: 'READY',
            eatedRabbits: eatedRabbits,
            length: length,
            direction: direction,
            score: 0,
            level: 1,
        });
    }

    setLevelDelay() {
        const { startDelay } = this.state.defaults,
            { level } = this.state,
            delay = startDelay - (startDelay * 0.01 - level);
        clearInterval(this.interval);
        this.interval = setInterval(this.tryToMove, delay);
    }

    toAddNewRabbit(busySpots) {
        const { width, height } = this.state;
        let isNewSpotFree = false,
            newSpot = {};
        while (!isNewSpotFree) {
            newSpot = {
                x: Math.floor(width * Math.random()),
                y: Math.floor(height * Math.random()),
            };
            isNewSpotFree = this.checkIfSpotIsFree(newSpot, busySpots);
        }
        return newSpot;
    }

    checkIfSpotIsFree(newSpot, busySpots) {
        const { rabbits } = this.state,
            dotsToBeChecked = busySpots || [];
        if (
            rabbits.findIndex(
                (rabbit) => newSpot.x === rabbit.x && newSpot.y === rabbit.y,
            ) !== -1
        )
            return false;
        if (
            dotsToBeChecked.findIndex(
                (snakePart) =>
                    newSpot.x === snakePart.x && newSpot.y === snakePart.y,
            ) !== -1
        )
            return false;
        return true;
    }

    restart() {
        console.info('~ Restart');
        this.gamePrepare();
    }

    render() {
        const {
                width,
                height,
                rabbits,
                snake,
                status,
                level,
                score,
                successMessage,
            } = this.state,
            snakeLength = snake.length,
            statusClassName =
                status === 'GAME_OVER'
                    ? 'status--game-over'
                    : status === 'PAUSE'
                    ? 'status--pause'
                    : '';

        return (
            <div className="bgame">
                {this.tokenError ? (
                    <div className="container mt-4">
                        <p className="text-white mt-4">
                            Sesión ha expirado. Por favor, inicia sesión
                            nuevamente.
                        </p>
                    </div>
                ) : (
                    <div className={`App ${statusClassName}`}>
                        <h1 className="tit1">Jugar</h1>
                        <div className="game-screen">
                            <PlayField
                                width={width}
                                height={height}
                                rabbits={rabbits}
                                snake={snake}
                            />
                            <StatsPanel
                                level={level}
                                snakeLength={snakeLength}
                                score={score}
                            >
                                <StatusMessage
                                    status={status}
                                    handleClick={this.restart.bind(this)}
                                />
                                {successMessage && (
                                    <Alert
                                        variant="primary"
                                        className="fontalert"
                                    >
                                        {successMessage}
                                    </Alert>
                                )}
                            </StatsPanel>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    token: state.auth.token,
});

export default connect(mapStateToProps)(AppWithHooks);
