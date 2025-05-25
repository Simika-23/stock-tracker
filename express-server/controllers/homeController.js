// Functions / APIs are made here.

const renderWelcome = (req, res) => {
    res.send('Welcome to Stock Tracker API!');
};

const aboutPage = (req, res) => {
    res.send('Welcome to the About Page');
    // NOTE: res.send and res.json can't be used together
    // You can only send one response
    // res.json({ name: 'Express Server' }); ← this will cause error
};


const createUser = async (req, res) => {
    res.send('User Created');
};

const loginUsers = (req,res) => {
    res.send("User Loggedin")
};

const viewProfile = (req,res) => {
    res.send("Profile viewed")
};

const changePassword = (req,res) => {
    res.send("Password Changed")
};

module.exports = {
    renderWelcome,
    aboutPage,
    createUser,
    loginUsers,
    viewProfile,
    changePassword
}

