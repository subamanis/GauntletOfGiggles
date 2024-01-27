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
    WaitingForPlayers = 'waitingForPlayers',
    InProgress = 'inProgress',
    FinishedSuccess = 'finishedSuccess',
    FinishedFailure = 'finishedFailure',
}

// export enum RealtimeDatabase