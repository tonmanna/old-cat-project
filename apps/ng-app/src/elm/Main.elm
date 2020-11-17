port module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (class, for, id, placeholder, type_, value)
import Html.Events exposing (onClick, onInput, onSubmit)
import Http
import Json.Decode
import List
import List.Extra


port sendToNG : String -> Cmd msg


port ngValueReceived : (String -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    ngValueReceived NgValueReceived


type alias Model =
    { playerName : String
    , ngValues : List ( String, ValidationStatus )
    , lastSubmit : Maybe String
    }


type ValidationStatus
    = Checking
    | Valid
    | Invalid


init : () -> ( Model, Cmd Msg )
init _ =
    ( { playerName = ""
      , ngValues = []
      , lastSubmit = Nothing
      }
    , Cmd.none
    )


type Msg
    = NgValueReceived String
    | PlayerNameChanged String
    | PlayerNameSubmit
    | SearchResultReceived String (Result Http.Error (List Player))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NgValueReceived value ->
            let
                nameMatched =
                    Maybe.map (\s -> removeVowels value |> containsChar s) model.lastSubmit
                        |> Maybe.withDefault True
            in
            ( { model
                | ngValues =
                    List.append model.ngValues
                        [ if nameMatched then
                            ( value, Checking )

                          else
                            ( value, Invalid )
                        ]
              }
            , if nameMatched then
                searhForPlayers value

              else
                Cmd.none
            )

        PlayerNameChanged name ->
            ( { model | playerName = name }, Cmd.none )

        PlayerNameSubmit ->
            ( { model | lastSubmit = Just model.playerName }
            , sendToNG model.playerName
            )

        SearchResultReceived playerName (Ok []) ->
            ( { model | ngValues = replaceLast ( playerName, Invalid ) model.ngValues }
            , Cmd.none
            )

        SearchResultReceived playerName (Ok _) ->
            ( { model | ngValues = replaceLast ( playerName, Valid ) model.ngValues }
            , Cmd.none
            )

        SearchResultReceived playerName (Err _) ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "py-4" ]
        [ h1 [ class "text-xl font-bold" ]
            [ text "Elm is here!" ]
        , form [ onSubmit PlayerNameSubmit ]
            [ div []
                [ label [ class "block text-sm font-medium leading-5 text-gray-700", for "email" ]
                    [ text "Player Name" ]
                , div [ class "mt-1 flex rounded-md shadow-sm" ]
                    [ div [ class "relative flex items-stretch flex-grow focus-within:z-10" ]
                        [ input
                            [ class "form-input block w-full rounded-none rounded-l-md border border-gray-300 pl-4 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                            , id "playerName"
                            , placeholder "Salah"
                            , value model.playerName
                            , onInput PlayerNameChanged
                            ]
                            []
                        ]
                    , button
                        [ class "-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
                        , type_ "submit"
                        ]
                        [ span [ class "ml-2" ]
                            [ text "Send" ]
                        ]
                    ]
                ]
            ]
        , h1 [ class "mt-8 text-xl font-bold" ]
            [ text "Received" ]
        , ul [ class "mt-4" ] <|
            List.map
                (\( v, status ) ->
                    li []
                        [ case status of
                            Valid ->
                                text <| v ++ " ✅"

                            Invalid ->
                                text <| v ++ " ❌"

                            Checking ->
                                text <| v ++ " ⏳"
                        ]
                )
                model.ngValues
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


removeVowels : String -> String
removeVowels original =
    Debug.log "vowels_removed" <| String.filter (\c -> not <| List.member c [ 'a', 'e', 'i', 'o', 'u' ]) original


containsChar : String -> String -> Bool
containsChar str input =
    let
        chars =
            String.toList input
    in
    String.filter (\c -> List.member c chars) str
        |> String.toList
        |> List.isEmpty
        |> not


searhForPlayers : String -> Cmd Msg
searhForPlayers name =
    Http.get
        { url = "http://localhost:3000/players?name=" ++ name
        , expect = Http.expectJson (SearchResultReceived name) (Json.Decode.list playerDecoder)
        }


type alias Player =
    { name : String
    , team : Maybe String
    , image : String
    }


playerDecoder : Json.Decode.Decoder Player
playerDecoder =
    Json.Decode.map3 Player
        (Json.Decode.at [ "name" ] Json.Decode.string)
        (Json.Decode.at [ "team" ] (Json.Decode.maybe Json.Decode.string))
        (Json.Decode.at [ "image" ] Json.Decode.string)


replaceLast : t -> List t -> List t
replaceLast item list =
    List.reverse list
        |> List.Extra.uncons
        |> Maybe.map Tuple.second
        |> Maybe.map ((::) item)
        |> Maybe.withDefault [ item ]
        |> List.reverse
