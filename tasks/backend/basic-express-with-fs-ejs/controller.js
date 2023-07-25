const fs = require("fs");
const crypto = require("crypto");

const fileInitializer = () => {
    if (!fs.existsSync("data.json")) {
        fs.writeFileSync("./data.json", "[]", "utf8");
    }
};

const create = (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!(name | email | password)) {
            return res
                .status(400)
                .send({ msg: "Provide the full detail for the user." });
        }

        // Check if user already with email exist or not
        const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
        const isUserExist = data.some((user) => user.email === email);
        if (isUserExist) {
            return res.status(400).send({ msg: "User already exist" });
        }

        // Generate 16 digits hex unique id
        const id = crypto.randomBytes(16).toString("hex");

        // Create a new object and add it into the data
        const obj = { id, name, email, password };
        data.push(obj);

        fs.writeFileSync("./data.json", JSON.stringify(data), "utf8");
        res.send({ obj });
    } catch (error) {
        res.send({ msg: error.message });
    }
};

const update = (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { id } = req.params;

        // Check if user already with email exist or not
        const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
        let userData;
        const isUserExist = data.some((user) => {
            userData = user;
            return user.id === id;
        });
        if (!isUserExist) {
            return res.status(404).send({ msg: "User not found." });
        }

        // Get and put the details given by user in an object.
        const newObj = {};
        if (name) {
            newObj.name = name;
        }
        if (email) {
            newObj.email = email;
        }
        if (password) {
            newObj.password = password;
        }

        // Create a new object and add it into the data
        const updatedUser = Object.assign({}, userData, newObj);
        data.some((user, index) => {
            if (user.id === id) {
                data[index] = updatedUser;
            }
        });

        // Save changes to the file
        fs.writeFileSync("./data.json", JSON.stringify(data), "utf8");
        res.send({ updatedUser });
    } catch (error) {
        res.send({ msg: error.message });
    }
};

const fetchAll = (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
        return res.send({ users: data });
    } catch (error) {
        res.send({ msg: error.message });
    }
};

module.exports = { create, fetchAll, update, fileInitializer };
