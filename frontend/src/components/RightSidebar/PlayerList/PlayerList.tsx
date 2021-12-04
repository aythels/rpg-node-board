import './playerList.css';
import PlayerCard from '../PlayerCard/PlayerCard';
import { useState, useMemo, useEffect, useCallback } from 'react';
import Dialog from '../../Dialog/Dialog';
import { User, UserPermission } from '../../../types';
import { useDispatch, useSelector } from 'react-redux';
import {
  removePlayer,
  selectGameMasterIds,
  selectUserIds,
  updatePlayerPermission,
} from '../../../state/slices/gameSlice';
import { RootState } from '../../../state/rootReducer';

interface Props {
  exposeSettings: boolean;
}

const PlayerList = (props: Props): JSX.Element => {
  const [playerToRemove, setPlayerToRemove] = useState<User['_id'] | undefined>(undefined);
  const [playerToDemote, setPlayerToDemote] = useState<User['_id'] | undefined>(undefined);
  const [playerToPromote, setPlayerToPromote] = useState<User['_id'] | undefined>(undefined);
  const [showDemoteLastGmModal, setShowDemoteLastGmModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const dispatch = useDispatch();

  const gameMasterIds: User['_id'][] = useSelector((state: RootState) => selectGameMasterIds(state));
  const userIds: User['_id'][] = useSelector((state: RootState) => selectUserIds(state));
  const currentUser: User = useSelector((state: RootState) => state.user.userInstance);

  const sortUsers = useCallback((gameMasterIds: User['_id'][], allUsers: User[]): User[] => {
    const A_FIRST = -1;
    const B_FIRST = 1;
    return [...allUsers].sort((a: User, b: User) => {
      const isGameMasterA = gameMasterIds.includes(a._id);
      const isGameMasterB = gameMasterIds.includes(b._id);
      if (isGameMasterA === isGameMasterB) {
        return a.username < b.username ? A_FIRST : B_FIRST;
      } else if (isGameMasterA && !isGameMasterB) {
        // Prioritize game masters
        return A_FIRST;
      } else {
        return B_FIRST;
      }
    });
  }, []);

  const fetchUsers = useCallback(async (userIds: User['_id'][]) => {
    const results: PromiseSettledResult<User>[] = await Promise.allSettled(
      userIds.map(async (userId) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`);
        const user = await response.json();
        return user;
      }),
    );

    const newUsers = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        newUsers.push(result.value);
      } else {
        console.error('Could not fetch user');
        console.error(result.reason);
      }
    }

    setUsers(sortUsers(gameMasterIds, newUsers));
  }, []);

  useEffect(() => {
    fetchUsers(userIds);
  }, [userIds]);

  useEffect(() => {
    setUsers(sortUsers(gameMasterIds, users));
  }, [gameMasterIds]);

  const handlePlayerRemove = (): void => {
    if (playerToRemove) {
      dispatch(removePlayer(playerToRemove));
      setPlayerToRemove(undefined);
    }
  };

  const handlePlayerPromote = (): void => {
    if (playerToPromote) {
      dispatch(updatePlayerPermission([playerToPromote, UserPermission.gameMaster]));
      setPlayerToPromote(undefined);
    }
  };

  const handlePlayerDemote = (): void => {
    if (playerToDemote) {
      dispatch(updatePlayerPermission([playerToDemote, UserPermission.player]));
      setPlayerToDemote(undefined);
    }
  };

  const handlePlayerDemoteRequested = (id: User['_id']): void => {
    const isLastGameMaster = gameMasterIds.length === 1;
    if (isLastGameMaster) {
      setShowDemoteLastGmModal(true);
    } else {
      setPlayerToDemote(id);
    }
  };

  return (
    <div className="canvas-sidebar-player-list">
      {users.map((user: User) => {
        const isCurrentPlayer = user._id === currentUser._id;
        const isGameMaster = gameMasterIds.includes(user._id);
        return (
          <PlayerCard
            key={user._id}
            user={user}
            exposeSettings={props.exposeSettings}
            promotable={!isGameMaster}
            removable={!isGameMaster && !isCurrentPlayer}
            onDemotePlayerClicked={() => handlePlayerDemoteRequested(user._id)}
            onPromotePlayerClicked={() => setPlayerToPromote(user._id)}
            onRemovePlayerClicked={() => setPlayerToRemove(user._id)}
          />
        );
      })}
      <Dialog
        description="Doing so will prevent them from re-joining the game."
        header="Remove player?"
        open={playerToRemove !== undefined}
        onAgree={handlePlayerRemove}
        onClose={() => setPlayerToRemove(undefined)}
        onDisagree={() => setPlayerToRemove(undefined)}
      />
      <Dialog
        description="Doing so will grant them game master privileges."
        header="Promote player to game master?"
        open={playerToPromote !== undefined}
        onAgree={handlePlayerPromote}
        onClose={() => setPlayerToPromote(undefined)}
        onDisagree={() => setPlayerToPromote(undefined)}
      />
      <Dialog
        description="Doing so will take game master privileges from them."
        header="Demote game master to regular player?"
        open={playerToDemote !== undefined}
        onAgree={handlePlayerDemote}
        onClose={() => setPlayerToDemote(undefined)}
        onDisagree={() => setPlayerToDemote(undefined)}
      />
      <Dialog
        description="A game must have at least one game master at all times."
        header="Cannot demote last game master"
        open={showDemoteLastGmModal}
        onClose={() => setShowDemoteLastGmModal(false)}
      />
    </div>
  );
};

export default PlayerList;
