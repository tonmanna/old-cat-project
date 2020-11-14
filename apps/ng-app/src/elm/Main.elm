module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)


type alias Model =
    ()


initialModel : Model
initialModel =
    ()


type Msg
    = NoOp


update : Msg -> Model -> Model
update _ _ =
    ()


view : Model -> Html Msg
view model =
    div [ class "py-4" ]
        [ h1 [ class "text-xl font-bold" ]
            [ text "Elm is here!" ]
        ]


main : Program () Model Msg
main =
    Browser.sandbox
        { init = initialModel
        , view = view
        , update = update
        }
