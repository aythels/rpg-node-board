import './playerList.css';
import PlayerCard from '../PlayerCard/PlayerCard';
import { useState, useMemo } from 'react';
import Dialog from '../../Dialog/Dialog';
import { User, UserPermission } from '../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { removePlayer, selectGameMasters, updatePlayerPermission } from '../../../state/slices/gameSlice';
import { RootState } from '../../../state/rootReducer';
import { selectUsers } from '../../../state/slices/gameSlice';

interface Props {
  exposeSettings: boolean;
}

const PlayerList = (props: Props): JSX.Element => {
  const [playerToRemove, setPlayerToRemove] = useState<User['_id'] | undefined>(undefined);
  const [playerToDemote, setPlayerToDemote] = useState<User['_id'] | undefined>(undefined);
  const [playerToPromote, setPlayerToPromote] = useState<User['_id'] | undefined>(undefined);
  const [showDemoteLastGmModal, setShowDemoteLastGmModal] = useState(false);

  const dispatch = useDispatch();

  const gameMasters = useSelector((state: RootState) => selectGameMasters(state));
  const users = useSelector((state: RootState) => selectUsers(state));
  const currentUser = useSelector((state: RootState) => state.user.userInstance);

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
    const isLastGameMaster = gameMasters.length === 1;
    if (isLastGameMaster) {
      setShowDemoteLastGmModal(true);
    } else {
      setPlayerToDemote(id);
    }
  };

  const prioritizeGameMasters = (gameMasters: User[], allUsers: User[]): User[] => {
    const A_BEFORE_B = -1;
    const B_BEFORE_A = 1;
    const gameMasterIds = new Set(gameMasters.map((gm) => gm._id));
    return [...allUsers].sort((a: User, b: User) => {
      const isGameMasterA = gameMasterIds.has(a._id);
      const isGameMasterB = gameMasterIds.has(b._id);
      if (isGameMasterA === isGameMasterB) {
        return a.username < b.username ? A_BEFORE_B : B_BEFORE_A;
      } else if (isGameMasterA && !isGameMasterB) {
        return A_BEFORE_B;
      } else {
        return B_BEFORE_A;
      }
    });
  };

  const sortedUsers = useMemo(() => {
    return prioritizeGameMasters(gameMasters, users);
  }, [gameMasters, users]);

  return (
    <div className="canvas-sidebar-player-list">
      {sortedUsers.map((user: User) => {
        const isCurrentPlayer = user._id === currentUser._id;
        const isGameMaster = gameMasters.some((gm: User) => gm._id === user._id);
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
