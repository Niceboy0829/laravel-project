import {getProfile} from "../requests/profile";

export const setProfile = (profile) => ({
    type: "SET_PROFILE",
    profile
});

export const startSetProfile = () => {
    return (dispatch) => {
        return getProfile().then((response) => {
                localStorage.setItem("profile", JSON.stringify(response));
                dispatch(setProfile(response));
                return response;
            }).catch((error) => {
                console.log(error);
                return error;
            });
    };
};