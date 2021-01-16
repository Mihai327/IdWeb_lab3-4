export const CFG = Object.freeze({
    toastDuration: 1.5 * 1000, // 1.5s in ms
    error: {
        E000: 'Something went wrong...',
        E001: '{0} has already been loaded. Import Core modules in the AppModule only.',
        E002: '{0} is invalid.',
        E003: '{0} is required.',
        E004: '{0} cannot be more than {1} characters long.',
        E005: '{0} must be more than {1} characters long.',
        E006: 'Your session expired.',
        E007: 'Login details incorrect, please try again.',
        E008: 'The requested record doesn\'t exists.'
        // E002: 'Login details incorrect, please try again.',
        // E003: 'Your session expired.',
        //
        // E007: 'Cannot find this address.',
        // E008: 'The requested record doesn\'t exists.',
        // E009: 'You don\'t have permission to modify a main category.',
        // E010: '{0} is invalid ({0} must be between {1} and {2} degrees inclusive).'
    },
    msg: {
        M001: 'Are you sure?',
        M002: 'Are you sure you want to perform this action?',
        M003: 'Delete current area?',

        M005: 'Successfully saved!',
        M006: 'Successfully updated!',
        M007: 'Successfully deleted!',
        M008: 'Discard changes?',
        M009: '<p>Are you sure you want to leave this page?</p><p>Your changes will be lost!</p>',
        M010: 'You can add your files by dropping them into the form area.',
        M011: 'Drop it like it’s hot',
        M012: 'Add your files by dropping them anywhere in the form area',

        /* Messages for route editor */
        M013: 'Delete selected item',
        M014: 'Are you sure you want to delete the selected item?',

        M015: 'No Internet Access!',
    },
    colors: ['#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#3949ab', '#1e88e5', '#00897b', '#43a047', '#c0ca33', '#fb8c00', '#3e2723'],
    statusColors: [
        '#77b2d6', '#bbbbbb', '#19d895', '#ff6258',
        '#ffaf00', '#e64a25', '#9877d6', '#8dd677',
        '#d68977', '#d277d6', '#ff6258', '#e3446f',
        '#bcd677', '#d677a7', '#808080', '#6e899a'
    ],
    years: Array.from({length: 30}, (v, k) => k + 1995).map(year => ({year: year}))
});

export enum DeleteStatuses {
    UNPROCCESSED = 0,
    PADDING = 1,
    COMPLETED = 2
}
