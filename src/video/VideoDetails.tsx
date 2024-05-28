import { useCallback, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChatIcon, TimeIcon } from '@chakra-ui/icons'
import { useParams } from "react-router-dom"
import { Box, Spinner, Text, HStack, VStack, Button, Textarea, useToast, AspectRatio } from "@chakra-ui/react"
import { Video } from "../types"
import { BACKEND_BASE_URL, USER_NAME, fetchFn, formatDateTime } from "../helpers"
import Navigator from "../components/Navigator"

type Comment = {
  created_at: string
  content: string
  user_id: string
  video_id: string
  id: string
}

const VideoDetails = () => {
  const { id } = useParams();

  const [comment, setComment] = useState('')

  const toast = useToast();

  const { data } = useQuery<{ video: Video }>({
    queryKey: ["videos", id],
    queryFn: () =>
      fetchFn(`${BACKEND_BASE_URL}/api/videos/single?video_id=${id}`)
        .then((res) => res.json())
  });

  const { data: comments, refetch: refetchComments } = useQuery<{ comments: Comment[] }>({
    queryKey: ["comments", id],
    queryFn: () =>
      fetchFn(`${BACKEND_BASE_URL}/api/videos/comments?video_id=${id}`)
        .then((res) => res.json())
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { videoId: string, comment: string }) =>
      fetchFn(`${BACKEND_BASE_URL}/api/videos/comments`, {
        method: "POST",
        body: JSON.stringify({
          video_id: data.videoId,
          content: data.comment,
          user_id: USER_NAME
        })
      })
      .then(() => {
        queryClient.setQueryData(['videos', id], (prev: { video: Video}) => ({
          video: {
            ...prev.video,
            num_comments: prev.video.num_comments + 1
          }
        }))

        toast({
          title: "Your comment has been added",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setComment('')
        refetchComments()
      })
  })

  const handleCommentClick = useCallback(() => {
    if (comment) {
      mutate({ comment, videoId: id! })
    }
  }, [comment])

  if (data?.video === undefined) {
    return <Spinner />
  }

  return (
    <VStack alignItems="start" w="full">
      <Box m="auto" mb="8" w="full">
        <AspectRatio ratio={16 / 9} w="full" maxW={600} m="auto">
          {data.video.video_url.includes('youtube') ? (
            <iframe src={data.video.video_url} />
          ) : (
            <video
              src={data.video.video_url}
              muted
              controls
              ref={video => video?.play()}
            />
          )}
        </AspectRatio>
      </Box>
      <Navigator title={data.video.title} spacing={0} w="full" />
      <HStack fontSize="small" flexWrap="wrap">
        <Box>
          <TimeIcon color="gray.400" mr="1" />
          {formatDateTime(data.video.created_at)}
        </Box>
        <Box>
          <ChatIcon color="gray.400" mr="1" />
          {data.video.num_comments}
        </Box>
      </HStack>
      <Text>{data.video.description}</Text>

      <VStack w="full" alignItems="end">
        <Textarea
          placeholder="Your comment here"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <Button
          size="sm"
          onClick={handleCommentClick}
          isLoading={isPending}
          isDisabled={!comment}
        >
          Post
        </Button>
      </VStack>
      {comments?.comments === undefined ? (
        <Spinner />
      ) : (
        <VStack spacing="4">
          {comments.comments.map((comment, key) => (
            <Box>
              <HStack>
                <small>
                  Posted by {comment.user_id}
                </small>
                <small>
                  <TimeIcon color="gray.400" mr="1" />
                  {formatDateTime(comment.created_at)}
                </small>
              </HStack>
              <Text key={key}>{comment.content}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  )
}

export default VideoDetails
