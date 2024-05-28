import {
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
  Input,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { USER_NAME, BACKEND_BASE_URL, fetchFn } from "../helpers";

const defaultValues = {
  title: "",
  description: "",
  url: "",
};

const URL_REGEX = /^https:\/\/[^\s/$.?#].[^\s]*$/i;

const NewVideo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const toast = useToast();

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: typeof defaultValues) =>
      fetchFn(`${BACKEND_BASE_URL}/api/videos`, {
        method: "POST",
        body: JSON.stringify({
          user_id: USER_NAME,
          description: data.description,
          video_url: data.url,
          title: data.title,
        }),
      }).then(() => {
        toast({
          title: "New video has been created.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
      }),
  });

  return (
    <VStack as="form" onSubmit={handleSubmit((data) => mutate(data))}>
      <FormControl isInvalid={!!errors.title}>
        <FormLabel>Title</FormLabel>
        <Input {...register("title", { required: true })} />
      </FormControl>
      <FormControl isInvalid={!!errors.url}>
        <FormLabel>URL</FormLabel>
        <Input
          {...register("url", {
            required: true,
            pattern: {
              value: URL_REGEX,
              message: "Please enter a valid URL",
            },
          })}
        />
        <FormHelperText>Youtube or other video url</FormHelperText>
      </FormControl>
      <FormControl isInvalid={!!errors.description}>
        <FormLabel>Description</FormLabel>
        <Textarea {...register("description", { required: true })} />
      </FormControl>
      <Button type="submit" isLoading={isPending}>
        Post
      </Button>
    </VStack>
  );
};

export default NewVideo;
