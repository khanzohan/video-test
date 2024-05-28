import { HStack, Box, Text, VStack  } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { TriangleUpIcon, ChatIcon, TimeIcon } from '@chakra-ui/icons'
import { USER_NAME, BACKEND_BASE_URL, formatDateTime, fetchFn } from "../helpers";
import type { Video } from "../types";

const VideoList = () => {
  const { data, isPending, isFetching } = useQuery<{ videos: Video[] }>({
    queryKey: ["videos"],
    queryFn: () =>
      fetchFn(`${BACKEND_BASE_URL}/api/videos?user_id=${USER_NAME}`).then((res) =>
        res.json()
      ),
  });

  return (
    <VStack alignItems="start" spacing="6">
      {data &&
        data.videos?.map((item, key) => (
          <HStack
            as={Link}
            key={key}
            to={`/videos/${item.id}`}
            spacing="4"
            role="group"
            alignItems="start"
          >
            <Box
              borderRadius="4"
              bgColor="gray.200"
              minW="24"
              h="14"
              display="flex"
            >
              <Box
                transform="rotate(90deg)"
                border="1px solid white"
                borderRadius="full"
                w="8"
                h="8"
                display="flex"
                m="auto"
              >
                <TriangleUpIcon color="white" m="auto" />
              </Box>
            </Box>
            <Box>
              <Text _groupHover={{ textDecor: "underline" }}>{item.title}</Text>
              <HStack fontSize="small" flexWrap="wrap">
                <Box>
                  <TimeIcon color="gray.400" mr="1" />
                  {formatDateTime(item.created_at)}
                </Box>
                <Box>
                  <ChatIcon color="gray.400" mr="1" />
                  {item.num_comments}
                </Box>
              </HStack>
            </Box>
          </HStack>
        ))}
    </VStack>
  );
};

export default VideoList;
