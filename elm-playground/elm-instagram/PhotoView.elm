module PhotoView exposing (..)

import Html exposing (..)
import Html.Attributes exposing (class, type_, src)
import Html.Events exposing (onClick)
import List exposing (repeat, map, append, reverse)


main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Photo =
    { user : String
    , location : String
    , likesCount : Int
    , commentsCount : Int
    , comments : List Comment
    , url : String
    }


type alias Comment =
    { user : String
    , message : String
    }


examplePhoto : Photo
examplePhoto =
    { user = "Puncher"
    , location = "Punchovce, Slovakia"
    , likesCount = 1000
    , commentsCount = 100
    , comments = repeat 10 exampleComment
    , url = "punchaunicorn.jpg"
    }


exampleComment : Comment
exampleComment =
    { user = "User"
    , message = "What a punch!"
    }


type Msg
    = LikePhoto
    | SubmitComment String
    | CloseModal


type alias Model =
    { photo : Photo
    , newComment : String
    , showCloseButton : Bool
    }


initialModel =
    Model examplePhoto "" True



-- INIT


init : ( Model, Cmd Msg )
init =
    ( initialModel, Cmd.none )



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LikePhoto ->
            ( model, Cmd.none )

        SubmitComment newComment ->
            ( { model | newComment = "" }, Cmd.none )

        CloseModal ->
            ( model, Cmd.none )



--VIEW


photo : String -> Html Msg
photo photoUrl =
    img [ class "photo", src photoUrl ] []


sidebar : Photo -> Html Msg
sidebar photo =
    div [ class "sidebar" ]
        [ sidebarTop photo.user photo.location
        , sidebarCount photo.likesCount photo.commentsCount
        , sidebarComments photo.commentsCount photo.comments
        ]


sidebarTop : String -> String -> Html Msg
sidebarTop user location =
    div [ class "sidebar-top" ]
        [ div [ class "photo-info" ]
            [ div [ class "user" ] [ text user ]
            , div [ class "location" ] [ text location ]
            ]
        , div [ class "photo-actions" ]
            [ followButton, likeButton ]
        ]


followButton : Html Msg
followButton =
    div [ class "follow-button" ]
        [ text "Follow" ]


likeButton : Html Msg
likeButton =
    div
        [ class "like-button"
        , onClick LikePhoto
        ]
        [ text "Like This Photo" ]


sidebarCount : Int -> Int -> Html Msg
sidebarCount likesCount commentsCount =
    let
        likesCountStr =
            toString likesCount

        commentsCountStr =
            toString commentsCount
    in
        div []
            [ text likesCountStr
            , text " likes, "
            , text commentsCountStr
            , text " comments"
            ]


sidebarComments : Int -> List Comment -> Html Msg
sidebarComments commentsCount comments =
    let
        pageSize =
            10

        pages =
            commentsCount // pageSize

        commentsList =
            comments
                |> List.map displayComment
                |> div [ class "comments-list" ]

        loadMoreItems =
            div [ class "load-more-comments" ]
                [ text "Load More Comments" ]

        container =
            if pages == 1 then
                [ commentsList ]
            else
                [ commentsList, loadMoreItems ]
    in
        div [ class "comments-container" ] container


displayComment : Comment -> Html Msg
displayComment { user, message } =
    div [ class "comment" ]
        [ div [ class "user" ] [ text user ]
        , div [ class "message" ] [ text message ]
        ]


closeButton : Html Msg
closeButton =
    div [ class "close-button", onClick CloseModal ]
        [ text "×" ]


view : Model -> Html Msg
view model =
    let
        photoHtml =
            photo model.photo.url

        sidebarHtml =
            sidebar model.photo

        html =
            case model.showCloseButton of
                True ->
                    [ photoHtml, sidebarHtml, closeButton ]

                False ->
                    [ photoHtml, sidebarHtml ]
    in
        div [ class "photo-view" ] html



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
