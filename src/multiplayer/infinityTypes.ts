export type InfinityStoneColor =
    | "Red"    // Reality Stone
    | "Blue"   // Space Stone
    | "Yellow" // Mind Stone
    | "Purple" // Power Stone
    | "Green"  // Time Stone
    | "Orange" // Soul Stone;


export  type PlayerPlaying = `${InfinityStoneColor}Playing`;

export  type PlayerScore = `${InfinityStoneColor}Score`;

export interface InfinityRoom {
    roomId: string;
}

export enum RoomState {
    NotStarted = 'notStarted',
    WaitingForPlayers = 'waitingForPlayers',
    InProgress = 'inProgress',
    FinishedSuccess = 'finishedSuccess',
    FinishedFailure = 'finishedFailure',
}

export type InfinityRoomData = {
    [key in PlayerPlaying]: boolean
} & {
    [key in PlayerScore]: number;
} & {
    RoomState: RoomState;
};

export enum RealtimeDatabasePaths {
    rooms = 'rooms',
}