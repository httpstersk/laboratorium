module CommentBox exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


-- MODEL


type alias Model =
    { newCommentText : String
    , newCommentUser : String
    , comments : List Comment
    }


model =
    { newCommentText = ""
    , newCommentUser = ""
    , comments =
        [ { name = "User A", description = "Hi!" }
        , { name = "User B", description = "Hello world!" }
        ]
    }


type alias Comment =
    { name : String
    , description : String
    }


author : String -> Comment -> String
author currentUser { name } =
    if currentUser == name then
        name ++ " (You)"
    else
        name



-- UPDATE


type Msg
    = AddComment
    | ChangeNewCommentUser String
    | ChangeNewCommentText String


update : Msg -> Model -> Model
update msg model =
    case msg of
        AddComment ->
            let
                comment =
                    { name = ("User " ++ model.newCommentUser)
                    , description = model.newCommentText
                    }
            in
                { model
                    | comments = comment :: model.comments
                    , newCommentText = ""
                }

        ChangeNewCommentUser username ->
            { model | newCommentUser = username }

        ChangeNewCommentText description ->
            { model | newCommentText = description }



-- VIEW


commentView : Comment -> Html Msg
commentView comment =
    div [ class "comment " ]
        [ text (author "User A" comment)
        , text " - "
        , text comment.description
        ]


commentList : Model -> Html Msg
commentList model =
    div [ class "comment-list " ]
        (List.map commentView model.comments)


inputUsername : Model -> Html Msg
inputUsername model =
    div []
        [ label [] [ text "User:" ]
        , input
            [ class "comment-input-user"
            , type_ "text"
            , value model.newCommentUser
            , onInput ChangeNewCommentUser
            ]
            []
        ]


inputComment : Model -> Html Msg
inputComment model =
    div []
        [ label [] [ text "Comment:" ]
        , textarea
            [ class "comment-input-text"
            , onInput ChangeNewCommentText
            , value model.newCommentText
            ]
            []
        ]


inputButton : Html Msg
inputButton =
    div []
        [ button
            [ class "comment-button-add"
            , onClick AddComment
            ]
            [ text "Add Comment " ]
        ]


view : Model -> Html Msg
view model =
    div [ class "comment-box" ]
        [ commentList model
        , div [ class "comment-input" ]
            [ inputUsername model
            , inputComment model
            , inputButton
            ]
        ]



-- MAIN


main =
    Html.beginnerProgram
        { model = model
        , view = view
        , update = update
        }
