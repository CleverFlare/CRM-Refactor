import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Wrapper from "../components/Wrapper";
import Breadcrumbs from "../components/Breadcrumbs";
import Publisher from "../components/Publisher";
import useControls from "../hooks/useControls";
import Post, { PostSkeleton } from "../components/Post";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { POSTS } from "../data/APIs";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../hooks/useRequest";
import filter from "../utils/ClearNull";
import format from "../utils/ISOToReadable";
import InputField from "../features/form/components/InputField";
import { DialogButton, DialogButtonsGroup } from "../features/dialog";
import useAfterEffect from "../hooks/useAfterEffect";
import PermissionsGate from "../features/permissions/components/PermissionsGate";
import routeGate from "../features/permissions/hoc/RouteGate";
import Compress from "react-image-file-resizer";

const Home = () => {
  //----store----
  const userInfo = useSelector((state) => state.userInfo.value);
  const postsStore = useSelector((state) => state.posts.value);

  const dispatch = useDispatch();

  //----request hooks----
  const [postsGetRequest, postsGetResponse] = useRequest({
    path: POSTS,
    method: "get",
  });

  const [postsDeleteRequest, postsDeleteResponse] = useRequest({
    path: POSTS,
    method: "delete",
    successMessage: "تم حذف المنشور بنجاح",
  });

  const [postsPostRequest, postsPostResponse] = useRequest({
    path: POSTS,
    method: "post",
    successMessage: "تم إضافة منشور بنجاح",
  });

  const [postsPatchRequest, postsPatchResponse] = useRequest({
    path: POSTS,
    method: "put",
    successMessage: "تم تعديل المنشور بنجاح",
  });

  //----state----
  const [postEditData, setPostEditData] = useState(null);
  const [{ controls, invalid }, { setControl, resetControls, validate }] =
    useControls([
      {
        control: "content",
        value: "",
        isRequired: true,
      },
      {
        control: "picture",
        value: null,
        isRequired: false,
      },
    ]);

  //----effects----
  useEffect(() => {
    postsGetRequest({
      onSuccess: (res) => {
        dispatch({ type: "posts/set", payload: res.data });
      },
    });
  }, []);

  //----functions----
  const resize = (file) => {
    return new Promise((resolve) => {
      Compress.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => resolve(uri),
        "file"
      );
    });
  };

  const handlePublishSubmit = async () => {
    await validate().then(async (output) => {
      if (!output.isOk) return;

      const compressedImage = await resize(controls.picture);

      const requestBody = filter({
        obj: {
          content: controls.content,
          user: 44806,
          media: compressedImage,
        },
        output: "formData",
      });
      await postsPostRequest({
        body: requestBody,
        onSuccess: (res) => {
          dispatch({ type: "posts/addItem", payload: res.data });
          resetControls();
        },
      });
    });
  };

  const handleDeletePost = (id) => {
    postsDeleteRequest({
      id,
      onSuccess: (res) => {
        dispatch({ type: "posts/deleteItem", payload: { id } });
      },
    });
  };

  const handleEditPost = (info) => {
    const requestBody = filter({
      obj: {
        content: info.data.content,
        user: 44806,
        media: info.data.pictures.files,
      },
      output: "formData",
    });
    postsPatchRequest({
      body: requestBody,
      id: info.data.id,
      onSuccess: (res) => {
        dispatch({
          type: "posts/putItem",
          payload: { id: res.data.id, item: res.data },
        });
        setPostEditData(null);
      },
    });
  };

  return (
    <Wrapper>
      <Breadcrumbs path={["الرئيسية"]} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <PermissionsGate permissions={["add_aqarpost"]}>
          <Publisher
            name={`${userInfo.first_name} ${userInfo.last_name}`}
            picture={userInfo.image}
            value={controls.content}
            onChange={(e) => setControl("content", e.target.value)}
            error={Boolean(invalid.content)}
            onSubmit={handlePublishSubmit}
            onPickPicture={(e) => setControl("picture", e.target.files[0])}
            onEmoji={(e, startIndex, endIndex, selected) => {
              setControl(
                "content",
                controls.content.slice(0, startIndex) +
                  selected.emoji +
                  controls.content.slice(endIndex, controls.content.length + 1)
              );
            }}
            isPending={postsPostResponse.isPending}
          />
        </PermissionsGate>

        <PermissionsGate permissions={["view_aqarpost"]}>
          <Typography
            variant="h6"
            color="primary"
            sx={{ padding: "30px 0", fontWeight: "bold" }}
          >
            احدث المنشورات
          </Typography>
          {postsGetResponse.isPending ? (
            <PostsSkeletons />
          ) : (
            postsStore.results.map((post, index) => (
              <Post
                key={`post ${index}`}
                name={post.user.name}
                picture={post.user.image}
                createdAt={post.created_at}
                images={post.medias}
                onDelete={
                  post.user.username === userInfo.username
                    ? () => handleDeletePost(post.id)
                    : null
                }
                onEdit={
                  post.user.username === userInfo.username
                    ? (data) => {
                        setPostEditData({ ...data, id: post.id });
                      }
                    : null
                }
                onPreventNotifications={
                  post.user.username === userInfo.username ? null : () => {}
                }
              >
                {post.content}
              </Post>
            ))
          )}
        </PermissionsGate>
      </Box>
      <PostEditDialog
        open={Boolean(postEditData)}
        onClose={() => setPostEditData(null)}
        data={
          postEditData
            ? postEditData
            : {
                name: "",
                image: "",
                children: "",
                createdAt: "2022-09-08T19:50:26.539479+02:00",
              }
        }
        onSubmit={handleEditPost}
      />
      {postsPostResponse.successAlert}
      {postsPostResponse.failAlert}
      {postsDeleteResponse.successAlert}
      {postsDeleteResponse.failAlert}
    </Wrapper>
  );
};

export default routeGate(Home, ["add_aqarpost", "view_aqarpost"]);

const PostEditDialog = ({ data, open, onClose, onSubmit }) => {
  const [{ controls, invalid }, { setControl, resetControls }] = useControls([
    {
      control: "content",
      value: "",
    },
    {
      control: "pictures",
      value: {
        files: null,
        displayed: "",
      },
    },
  ]);

  //----hooks----
  const inputFileRef = useRef(null);

  //----functions----
  const handleEditSubmit = () => {
    onSubmit({ data: { ...controls, id: data.id }, invalid });
  };

  useAfterEffect(() => {
    if (!open) return;
    setControl("content", data.children);
    setControl("pictures", {
      files: null,
      display: data.images?.[0]?.media,
    });
  }, [data]);

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      PaperProps={{
        sx: {
          maxWidth: "max-content",
        },
      }}
    >
      <DialogContent sx={{ maxWidth: "max-content" }}>
        <Card
          sx={{
            maxWidth: "766px",
            width: "100vmax",
            boxShadow: "none",
          }}
        >
          <CardHeader
            avatar={
              <Avatar src={data?.image}>
                {data?.name ? data?.name[0] : ""}
              </Avatar>
            }
            title={data?.name}
            subheader={format(data?.createdAt)}
            sx={{
              "& .MuiCardHeader-title": { color: "#233975" },
              "& .MuiCardHeader-subheader": {
                color: "#233975",
                fontSize: "12px",
              },
            }}
          />
          <CardContent>
            <Box
              sx={{
                padding: "0 55px",
              }}
            >
              <InputField
                value={controls.content}
                onChange={(e) => setControl("content", e.target.value)}
                sx={{ width: "100%" }}
              />
            </Box>
          </CardContent>
          {controls?.pictures?.display && (
            <>
              <input
                type="file"
                style={{ display: "none" }}
                ref={inputFileRef}
                onChange={(e) => {
                  const blob = URL.createObjectURL(e.target.files?.[0]);

                  setControl("pictures", {
                    files: [
                      ...Object.keys(e.target.files).map(
                        (key) => e.target.files[key]
                      ),
                    ],
                    display: blob,
                  });
                }}
              />
              <CardMedia
                component="img"
                image={controls?.pictures?.display}
                alt="posts image"
                sx={{
                  bgcolor: "black",
                  objectFit: "contain",
                  aspectRatio: "2 / 1",
                  cursor: "pointer",
                }}
                onClick={() => inputFileRef.current.click()}
              />
            </>
          )}
        </Card>
      </DialogContent>
      <DialogButtonsGroup>
        <DialogButton variant="save" onClick={handleEditSubmit}>
          حفظ
        </DialogButton>
        <DialogButton variant="close" onClick={onClose}>
          إلغاء
        </DialogButton>
      </DialogButtonsGroup>
    </Dialog>
  );
};

const PostsSkeletons = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        WebkitMaskImage:
          "linear-gradient(0deg, rgba(9,9,121,0) 0%, rgba(255,255,255,1) 100%)",
        maxHeight: 600,
      }}
    >
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </Box>
  );
};
