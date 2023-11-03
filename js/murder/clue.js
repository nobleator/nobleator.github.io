window.callMe = (offset) => {
    // Which clue is missing?
    const x = new Uint8Array([74,115,124,108,39,62,39,118,109,39,62,65,39,72,115,112,106,108,39,104,121,121,112,125,108,107,39,104,109,123,108,121,39,123,111,108,39,118,126,117,108,121,39,118,109,39,123,111,108,39,119,104,121,121,118,123,53].map(x => x - offset));;
    const decoder = new TextDecoder();
    return decoder.decode(x);
}