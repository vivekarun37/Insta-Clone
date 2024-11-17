import { Avatar, Box, Button, Flex, VStack } from "@chakra-ui/react";
import useFollowUser from "../../Hooks/useFollowUser";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

const SuggestedUser = ({ user, setUser }) => {
    const authUser = useAuthStore((state) => state.user);

    // Check if user or authUser is undefined
    if (!user || !authUser) {
        console.error("user or authUser is undefined:", { user, authUser });
        return null; // Render nothing or fallback UI
    }

    const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(user.uid);

    const onFollowUser = async () => {
        try {
            await handleFollowUser();
            // Update the local user state with updated followers
            setUser({
                ...user,
                followers: isFollowing
                    ? user.followers.filter((follower) => follower.uid !== authUser.uid)
                    : [...user.followers, authUser],
            });
        } catch (error) {
            console.error("Failed to update follow status:", error.message);
        }
    };

    return (
        <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
            <Flex alignItems={"center"} gap={2}>
                <Link to={`/${user.username}`}>
                    <Avatar
                        src={user.profilePicURL}
                        size={"md"}
                        aria-label={`Profile picture of ${user.fullName}`}
                    />
                </Link>
                <VStack spacing={2} alignItems={"flex-start"}>
                    <Link to={`/${user.username}`}>
                        <Box fontSize={12} fontWeight={"bold"}>
                            {user.fullName}
                        </Box>
                    </Link>
                    <Box fontSize={11} color={"gray.500"}>
                        {user.followers?.length || 0} followers
                    </Box>
                </VStack>
            </Flex>
            {authUser.uid !== user.uid && (
                <Button
                    fontSize={13}
                    bg={"transparent"}
                    p={0}
                    h={"max-content"}
                    fontWeight={"medium"}
                    color={"blue.400"}
                    cursor={"pointer"}
                    _hover={{ color: "white" }}
                    onClick={onFollowUser}
                    isLoading={isUpdating}
                    aria-label={isFollowing ? "Unfollow user" : "Follow user"}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Button>
            )}
        </Flex>
    );
};

export default SuggestedUser;
