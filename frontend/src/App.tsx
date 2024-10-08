import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/system';

type Player = {
  id: number;
  position: number;
};

type GameState = {
  players: Player[];
  currentPlayer: number;
  winner: number | null;
};

const StyledGameBoard = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(10, 1fr)',
  gap: theme.spacing(0.25),
  maxWidth: '600px',
  margin: '0 auto',
}));

const StyledCell = styled(Box)(({ theme }) => ({
  aspectRatio: '1',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  position: 'relative',
}));

const PlayerToken = styled(Box)<{ player: number }>(({ theme, player }) => ({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  position: 'absolute',
  backgroundColor: player === 0 ? theme.palette.primary.main : theme.palette.secondary.main,
  ...(player === 0 ? { left: '5px', top: '5px' } : { right: '5px', bottom: '5px' }),
}));

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = async () => {
    try {
      setLoading(true);
      const initialState = await backend.initGame();
      setGameState(initialState);
      setError(null);
    } catch (err) {
      setError('Failed to initialize game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGameState = async () => {
    try {
      const state = await backend.getGameState();
      setGameState(state);
      setError(null);
    } catch (err) {
      setError('Failed to fetch game state. Please try again.');
    }
  };

  const handleRollDice = async () => {
    if (!gameState || gameState.winner !== null) return;

    try {
      setLoading(true);
      const roll = await backend.rollDice();
      setDiceRoll(roll);
      await handleMove(roll);
      setError(null);
    } catch (err) {
      setError('Failed to roll dice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (steps: number) => {
    if (!gameState) return;

    try {
      const result = await backend.movePlayer(gameState.currentPlayer, steps);
      if ('ok' in result) {
        setGameState(result.ok);
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('Failed to move player. Please try again.');
    }
  };

  const renderBoard = () => {
    const cells = [];
    for (let i = 100; i > 0; i--) {
      const row = Math.floor((i - 1) / 10);
      const col = (i - 1) % 10;
      const cellNumber = row % 2 === 0 ? i : 100 - (row * 10) - (9 - col);

      cells.push(
        <StyledCell key={i}>
          {cellNumber}
          {gameState?.players.map((player) =>
            player.position === cellNumber ? (
              <PlayerToken key={player.id} player={player.id} />
            ) : null
          )}
        </StyledCell>
      );
    }
    return cells;
  };

  if (!gameState) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Snakes and Ladders
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <StyledGameBoard>{renderBoard()}</StyledGameBoard>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>
          Current Player: {gameState.currentPlayer === 0 ? 'Green' : 'Blue'}
        </Typography>
        <Button
          variant="contained"
          onClick={handleRollDice}
          disabled={loading || gameState.winner !== null}
        >
          {loading ? <CircularProgress size={24} /> : 'Roll Dice'}
        </Button>
        {diceRoll && <Typography>Dice Roll: {diceRoll}</Typography>}
      </Box>
      {gameState.winner !== null && (
        <Typography variant="h5" sx={{ mt: 2 }}>
          Player {gameState.winner === 0 ? 'Green' : 'Blue'} wins!
        </Typography>
      )}
      <Button
        variant="outlined"
        onClick={initGame}
        sx={{ mt: 2 }}
      >
        New Game
      </Button>
    </Box>
  );
};

export default App;