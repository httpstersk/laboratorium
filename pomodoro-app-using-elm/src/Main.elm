module Main exposing (..)

import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Time exposing (Time, second)
import String


-- Model


type Status
    = Relax
    | Focus


type Mode
    = Elapsed
    | Remaining


type alias Model =
    { counting : Bool
    , timerStatus : Status
    , timerMode : Mode
    , seconds : Int
    , pomsCompleted : Int
    }



-- Number of seconds for a normal relax mode


relaxLimit : Int
relaxLimit =
    5 * 60



-- Number of seconds for a normal focus mode


focusLimit : Int
focusLimit =
    25 * 60



-- Update


type Msg
    = Tick Time
    | Start
    | Pause
    | Clear
    | ElapsedMode
    | RemainingMode


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Start ->
            ( model
                |> startCounting
            , Cmd.none
            )

        Pause ->
            ( model
                |> stopCounting
            , Cmd.none
            )

        Clear ->
            ( model
                |> stopCounting
                |> zeroClock
                |> resetPomsCompleted
            , Cmd.none
            )

        ElapsedMode ->
            ( { model | timerMode = Elapsed }, Cmd.none )

        RemainingMode ->
            ( { model | timerMode = Remaining }, Cmd.none )

        Tick _ ->
            case
                ( model.counting
                , model.timerStatus
                , model.seconds
                )
            of
                ( False, _, _ ) ->
                    ( model, Cmd.none )

                ( True, Focus, 1500 ) ->
                    ( model
                        |> flipStatus
                        |> zeroClock
                    , Cmd.none
                    )

                ( True, Relax, 300 ) ->
                    ( model
                        |> flipStatus
                        |> zeroClock
                        |> markPomComplete
                    , Cmd.none
                    )

                ( True, _, s ) ->
                    ( model
                        |> tickSecond s
                    , Cmd.none
                    )


resetPomsCompleted : Model -> Model
resetPomsCompleted model =
    { model | pomsCompleted = 0 }


stopCounting : Model -> Model
stopCounting model =
    { model | counting = False }


startCounting : Model -> Model
startCounting model =
    { model | counting = True }


tickSecond : Int -> Model -> Model
tickSecond s model =
    { model | seconds = s + 1 }


flipStatus : Model -> Model
flipStatus model =
    case (model.timerStatus) of
        Focus ->
            { model | timerStatus = Relax }

        Relax ->
            { model | timerStatus = Focus }


zeroClock : Model -> Model
zeroClock model =
    { model | seconds = 0 }


markPomComplete : Model -> Model
markPomComplete model =
    { model | pomsCompleted = model.pomsCompleted + 1 }



-- View


view : Model -> Html Msg
view model =
    div [ id "app" ]
        [ makeHeader
        , makeMainPage model
        , makeFooter model
        ]


makeHeader : Html Msg
makeHeader =
    header []
        [ h2 [ class "center" ] [ text "Pomodoro" ] ]


makeFooter : Model -> Html Msg
makeFooter model =
    footer []
        [ pre [] [ text <| toString model ]
        ]


makeMainPage : Model -> Html Msg
makeMainPage model =
    main' []
        [ makeButtonCluster
        , makeClock model
        ]


makeButtonCluster : Html Msg
makeButtonCluster =
    div [ id "buttons", class "center" ]
        [ button [ onClick Start ] [ text "Start" ]
        , button [ onClick Pause ] [ text "Pause" ]
        , button [ onClick Clear ] [ text "Clear" ]
        ]


makeClock : Model -> Html Msg
makeClock model =
    div [ id "clock", class "center" ]
        [ div [ statusChecker model.timerStatus ]
            [ text <| toString model.timerStatus ]
        , div [ class "time" ]
            [ text <| timeMaker model ]
        , bezelButtonMaker "Elapsed" ElapsedMode model
        , bezelButtonMaker "Remaining" RemainingMode model
        ]


timeMaker : Model -> String
timeMaker model =
    case ( model.timerMode, model.timerStatus, model.seconds ) of
        ( Elapsed, _, s ) ->
            getClockString s

        ( Remaining, Relax, s ) ->
            getClockString <| (relaxLimit - s)

        ( Remaining, Focus, s ) ->
            getClockString <| (focusLimit - s)


getClockString : Int -> String
getClockString sec =
    let
        formatter x =
            if (String.length <| toString x) == 1 then
                "0" ++ toString x
            else
                toString x

        madeMinutes =
            sec // 60

        madeSeconds =
            rem sec 60
    in
        formatter madeMinutes ++ ":" ++ formatter madeSeconds


statusChecker : Status -> Html.Attribute Msg
statusChecker status =
    case status of
        Relax ->
            class "status relax"

        Focus ->
            class "status focus"


bezelButtonMaker : String -> Msg -> Model -> Html Msg
bezelButtonMaker name msg model =
    button
        [ onClick msg, getBezelButtonClass name model ]
        [ text name ]


getBezelButtonClass : String -> Model -> Html.Attribute Msg
getBezelButtonClass name model =
    if name == (toString model.timerMode) then
        class "active"
    else
        class "inactive"



-- Init


init : ( Model, Cmd Msg )
init =
    ( { counting = False
      , timerStatus = Focus
      , timerMode = Remaining
      , seconds = 0
      , pomsCompleted = 0
      }
    , Cmd.none
    )



-- Subscription


subscriptions : Model -> Sub Msg
subscriptions model =
    Time.every second Tick



-- Main


main : Program Never
main =
    App.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
