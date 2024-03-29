export type InfinityStoneColor =
    | "Red"    // Reality Stone
    | "Blue"   // Space Stone
    | "Yellow" // Mind Stone
    | "Purple" // Power Stone
    | "Green"  // Time Stone
    | "Orange" // Soul Stone;

export const GemToImageMap: Record<InfinityStoneColor, string> = {
    "Yellow": "Head",
    "Blue": "LeftHand",
    "Red": "RightHand",
    "Purple": "LeftLeg",
    "Green": "RightLeg",
    "Orange": "Torso",
}

export const infinityStoneColorsInArray: InfinityStoneColor[] = ["Red", "Blue", "Yellow", "Purple", "Green", "Orange"]; // Hate this

export  type PlayerPlaying = `${InfinityStoneColor}Playing`;

export  type PlayerScore = `${InfinityStoneColor}Score`;

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
    RoomState: RoomState;
};

export type InfinityRoomDataScoresIncrementBy = {
    [key in PlayerScore]: object; // For incremental scoring
}

export type InfinityRoomDataScoresNumber = {
    [key in PlayerScore]: number;
}

export enum RealtimeDatabasePaths {
    rooms = 'rooms',
    scores = 'scores',
}